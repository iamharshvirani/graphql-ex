package main

import (
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"github.com/rs/cors"
)

// Book data model
type Book struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Author  string `json:"author"`
	Summary string `json:"summary"`
}

// Sample data
var books = []Book{
	{ID: 1, Title: "1984", Author: "George Orwell", Summary: "A dystopian novel set in a totalitarian regime where critical thought is suppressed."},
	{ID: 2, Title: "Brave New World", Author: "Aldous Huxley", Summary: "A futuristic society where humans are genetically engineered and conditioned to serve societal stability."},
}

// Define GraphQL BookType
var bookType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Book",
	Fields: graphql.Fields{
		"id":      &graphql.Field{Type: graphql.Int},
		"title":   &graphql.Field{Type: graphql.String},
		"author":  &graphql.Field{Type: graphql.String},
		"summary": &graphql.Field{Type: graphql.String},
	},
})

// Root query
var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"books": &graphql.Field{
			Type: graphql.NewList(bookType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return books, nil
			},
		},
		"book": &graphql.Field{
			Type: bookType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, ok := p.Args["id"].(int)
				if ok {
					for _, book := range books {
						if book.ID == id {
							return book, nil
						}
					}
				}
				return nil, nil
			},
		},
	},
})

// Root mutation
var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"createBook": &graphql.Field{
			Type: bookType,
			Args: graphql.FieldConfigArgument{
				"title":   &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				"author":  &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				"summary": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				title, _ := p.Args["title"].(string)
				author, _ := p.Args["author"].(string)
				summary, _ := p.Args["summary"].(string)

				// Generate a new ID (simple implementation)
				maxID := 0
				for _, book := range books {
					if book.ID > maxID {
						maxID = book.ID
					}
				}
				newID := maxID + 1

				// Create new book
				newBook := Book{
					ID:      newID,
					Title:   title,
					Author:  author,
					Summary: summary,
				}

				// Add to books slice
				books = append(books, newBook)
				return newBook, nil
			},
		},
		"updateBook": &graphql.Field{
			Type: bookType,
			Args: graphql.FieldConfigArgument{
				"id":      &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.Int)},
				"title":   &graphql.ArgumentConfig{Type: graphql.String},
				"author":  &graphql.ArgumentConfig{Type: graphql.String},
				"summary": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(int)
				title, titleOk := p.Args["title"].(string)
				author, authorOk := p.Args["author"].(string)
				summary, summaryOk := p.Args["summary"].(string)

				for i, book := range books {
					if book.ID == id {
						if titleOk {
							books[i].Title = title
						}
						if authorOk {
							books[i].Author = author
						}
						if summaryOk {
							books[i].Summary = summary
						}
						return books[i], nil
					}
				}
				return nil, nil
			},
		},
		"deleteBook": &graphql.Field{
			Type: bookType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.Int)},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(int)

				for i, book := range books {
					if book.ID == id {
						// Save the book to return
						deletedBook := book

						// Remove the book from the slice
						books = append(books[:i], books[i+1:]...)

						return deletedBook, nil
					}
				}
				return nil, nil
			},
		},
	},
})

// Schema
var schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
})

func main() {
	// GraphQL handler
	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true, // Enable GraphiQL UI
	})

	// Add CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Allow the React app's origin
		AllowCredentials: true,
		Debug:            true,
	})

	http.Handle("/graphql", c.Handler(h))
	log.Println("Server running on http://localhost:8080/graphql")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
