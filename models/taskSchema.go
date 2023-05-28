package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskWrite struct {
	Title       string `bson:"title" json:"title"`
	Description string `bson:"description" json:"description"`
	DueDate     string `bson:"dueDate" json:"dueDate"`
}

type TaskCommon struct {
	ID          primitive.ObjectID `bson:"_id" json:"_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	DueDate     time.Time          `bson:"dueDate" json:"dueDate"`
}

type TaskSchema struct {
	ID          primitive.ObjectID `bson:"_id" json:"_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	DueDate     string             `bson:"dueDate" json:"dueDate"`
}

type DeleteSchema struct {
	ID primitive.ObjectID `bson:"_id" json:"_id"`
}
