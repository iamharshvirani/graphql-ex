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
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
}

// Sample data
var books = []Book{
	{ID: 1, Title: "1984", Author: "George Orwell"},
	{ID: 2, Title: "Brave New World", Author: "Aldous Huxley"},
}

// Define GraphQL BookType
var bookType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Book",
	Fields: graphql.Fields{
		"id":     &graphql.Field{Type: graphql.Int},
		"title":  &graphql.Field{Type: graphql.String},
		"author": &graphql.Field{Type: graphql.String},
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

// Schema
var schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query: rootQuery,
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
