package main

import (
	"flag"
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"
	"log"
)

const (
	staticUrl = "/static"
)

var (
	httpAddr = flag.String("http", defaultAddr, "Listen for HTTP connections on this address.")
)

func init() {
	flag.Parse()
	if err := cacheTemplates([]string{
		"templates/home.tmpl",
		"templates/new_task.tmpl",
	}); err != nil {
		log.Fatal(err)
	}

}

func app() *echo.Echo {
	e := echo.New()

	// Default Middlewares
	e.Use(middleware.Logger())
	e.Use(middleware.Gzip())
	e.Use(middleware.Recover())

	// Groups
	h := e.Group("")
	html := e.Group("/html")
	s := e.Group(staticUrl)

	h.GET("/", home())
	h.GET("/new", newTaskPage())
	h.POST("/new", createNewTask())

	html.GET("/", renderHomeContainer())
	html.GET("/new", renderNewTaskContainer())

	// Static
	s.GET("/:folder/:file", serveFile())
	s.GET("/favicon.ico", serveFavicon())

	return e
}

func main() {
	e := app()
	// Start server
	e.Run(standard.New(*httpAddr))
}
