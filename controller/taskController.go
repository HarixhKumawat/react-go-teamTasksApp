package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"main/models"
	model "main/models"
	"net/http"
	"time"

	"github.com/gorilla/sessions"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Classfiied(store *sessions.CookieStore, f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session, err := store.Get(r, "cookie-name")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			http.Error(w, "forbidden", http.StatusUnauthorized)
			return
		}
		f(w, r)
	}
}

func Validate(store *sessions.CookieStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var secureSession model.SecureS
		err := json.NewDecoder(r.Body).Decode(&secureSession)
		fmt.Print(secureSession.SessionId)

		if err != nil {
			fmt.Print("the thing ddidnt match")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		session, err := store.Get(r, "cookie-name")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		fmt.Println("checking for session valid", session.Values["authenticated"])

		fmt.Fprint(w, "do all", session.Values["authenticated"])
	}
}
func GetAllTasks(tasksCollection *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// if !auth {
		// 	http.Error(w, "forbidden", http.StatusUnauthorized)
		// 	return
		// }

		var taskList []models.TaskCommon

		taskInit, err := tasksCollection.Find(context.TODO(), bson.D{{}})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		for taskInit.Next(context.TODO()) {
			var task models.TaskCommon

			err := taskInit.Decode(&task)
			if err != nil {
				log.Fatal(err)
			}

			taskList = append(taskList, task)
		}

		if err := taskInit.Err(); err != nil {
			log.Fatal(err)
		}
		taskInit.Close(context.TODO())

		Data := map[string]any{
			"status":  200,
			"message": "sending all tasks",
			"tasks":   taskList,
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Data)
	}
}

func GetTask(store *sessions.CookieStore, tasksCollection *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		Data := map[string]any{
			"status":  200,
			"message": "very secure info",
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Data)

	}
}

func EditTasks(tasksCollection *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var editTask model.TaskSchema
		err := json.NewDecoder(r.Body).Decode(&editTask)
		dueDate, _ := time.Parse("2006-01-02", editTask.DueDate)

		if err != nil {
			fmt.Print("the thing ddidnt match")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		fmt.Println(editTask.ID)

		filter := bson.D{
			{Key: "_id", Value: editTask.ID},
		}
		update := bson.D{{Key: "$set", Value: bson.D{
			{Key: "title", Value: editTask.Title},
			{Key: "description", Value: editTask.Description},
			{Key: "dueDate", Value: dueDate},
		}}}
		var updatedTask model.TaskCommon

		err = tasksCollection.FindOneAndUpdate(context.TODO(), filter, update).Decode(&updatedTask)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		Data := map[string]any{
			"status":  200,
			"updated": updatedTask,
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Data)
	}
}
func DeleteTasks(tasksCollection *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var deleteTask model.DeleteSchema
		err := json.NewDecoder(r.Body).Decode(&deleteTask)
		if err != nil {
			fmt.Print("the thing ddidnt match")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		DeleteTaskDoc := bson.D{
			{Key: "_id", Value: deleteTask.ID},
		}
		result, err := tasksCollection.DeleteOne(context.TODO(), DeleteTaskDoc)

		if err != nil {
			panic(err)
		}

		Data := map[string]any{
			"status": 200,
			"resilt": result,
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Data)
	}
}

func WriteTasks(tasksCollection *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newTask model.TaskWrite
		err := json.NewDecoder(r.Body).Decode(&newTask)
		dueDate, _ := time.Parse("2006-01-02", newTask.DueDate)

		if err != nil {
			fmt.Print("the thing ddidnt match")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		newTaskDoc := bson.D{
			{Key: "title", Value: newTask.Title},
			{Key: "description", Value: newTask.Description},
			{Key: "dueDate", Value: dueDate},
		}

		result, err := tasksCollection.InsertOne(context.TODO(), newTaskDoc)
		if err != nil {
			panic(err)
		}
		Data := map[string]any{
			"status": 200,
			"resilt": result,
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Data)
	}
}
