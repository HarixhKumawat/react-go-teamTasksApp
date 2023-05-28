package main

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"os"

	ctrl "main/controller"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	// key must be 16, 24 or 32 bytes long (AES-128, AES-192 or AES-256)
	key   = []byte(os.Getenv("JWT_SECRETKEY"))
	store = sessions.NewCookieStore(key)
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	connectionUrl := os.Getenv("MONGO_URI")

	if connectionUrl == "" {
		log.Fatal("You must set your 'MONGODB_URI' environmental variable. See\n\t https://www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(connectionUrl))
	if err != nil {
		panic(err)
	}

	userCollection := client.Database("testing").Collection("int_user")
	tasksCollection := client.Database("testing").Collection("tasks")

	r := mux.NewRouter()
	fs := http.FileServer(http.Dir("./assets/"))
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, err := template.ParseFiles("./index.html")
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		if err := t.Execute(w, ""); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
	})

	r.HandleFunc("/login", ctrl.UserLoginHandler(userCollection, store)).Methods("POST")
	r.HandleFunc("/register", ctrl.UserRegisterHandler(userCollection)).Methods("POST")
	r.HandleFunc("/getAllTasks", ctrl.Classfiied(store, ctrl.GetAllTasks(tasksCollection))).Methods("POST")

	r.HandleFunc("/writeTasks", ctrl.Classfiied(store, ctrl.WriteTasks(tasksCollection))).Methods("POST")
	r.HandleFunc("/editTasks", ctrl.Classfiied(store, ctrl.EditTasks(tasksCollection))).Methods("PUT")
	r.HandleFunc("/deleteTasks", ctrl.Classfiied(store, ctrl.DeleteTasks(tasksCollection))).Methods("DELETE")

	log.Printf("server started on http://localhost:7000")
	http.ListenAndServe(":7000", r)
}
