package controller

import (
	"encoding/json"
	"fmt"
	model "main/models"
	"math/rand"
	"net/http"

	"github.com/gorilla/sessions"
	"go.mongodb.org/mongo-driver/mongo"
)

func get_randomString(n int) string {
	var letters = []rune("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)

}

func UserLoginHandler(userCollection *mongo.Collection, store *sessions.CookieStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userLogin model.UserCommon

		err := json.NewDecoder(r.Body).Decode(&userLogin)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		authenticated := authenticate(userLogin.Username, userLogin.Password, userCollection)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if !authenticated {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}

		sessionId := get_randomString(8)

		session, _ := store.Get(r, "cookie-name")
		session.Values["authenticated"] = true
		session.Save(r, w)
		fmt.Println(session.ID)

		Data := map[string]any{
			"status":    200,
			"message":   "login succesful",
			"sessionId": sessionId,
		}

		fmt.Println("doing for session valid", session.Values["authenticated"])

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(Data)
	}
}
