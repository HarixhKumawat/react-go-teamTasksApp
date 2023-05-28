package controller

import (
	"context"
	"encoding/json"
	"fmt"
	model "main/models"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
func CheckPasswordHash(password string, hash string) bool {
	fmt.Print("```" + password + hash + "```")
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	fmt.Print(err)
	return err == nil
}

func authenticate(username string, password string, userCollection *mongo.Collection) bool {
	filter := bson.D{
		{Key: "username", Value: username},
	}
	var user model.UserSchema

	err := userCollection.FindOne(context.TODO(), filter).Decode(&user)

	if err != nil {
		return false
	}
	fmt.Println(user.ID)

	if CheckPasswordHash(password, user.Password) {
		fmt.Print("-authdone")
		return true
	}
	fmt.Print("-authfail")
	return false
}

func UserRegisterHandler(userCollection *mongo.Collection) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newUser model.UserCommon
		err := json.NewDecoder(r.Body).Decode(&newUser)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		HashedPassword, err := HashPassword(newUser.Password)
		if err != nil {
			http.Error(w, "Something went wrong!!!", http.StatusInternalServerError)
			return
		}

		newUserDoc := bson.D{
			{Key: "username", Value: newUser.Username},
			{Key: "password", Value: HashedPassword},
		}

		result, err := userCollection.InsertOne(context.TODO(), newUserDoc)

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
