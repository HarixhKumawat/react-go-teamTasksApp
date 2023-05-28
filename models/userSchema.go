package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserCommon struct {
	Username string `bson:"username" json:"username"`
	Password string `bson:"password" json:"password"`
}

type UserSchema struct {
	ID       primitive.ObjectID `bson:"_id" json:""_id`
	Username string             `bson:"username" json:"username"`
	Password string             `bson:"password" json:"password"`
}
