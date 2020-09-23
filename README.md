
# Warna-Warni-Days-Django-React (toy project)

Warna-Warni-Days is a website where users can associate a color to their days, based on their emotional state of the moment, with the ability to answer a few prompts to explicit why they chose which color for which day.

The goal is to make a simple tool for people to track their emotions on the long run, without any self-judgment (days do not have labels, they have colors that the user is free to associate to whatever feeling they have).

## Getting Started

The project is fully containerized with docker. If you have docker and docker-compose installed, all you need to get started is to

1. Clone the repo && cd into it
2. `docker-compose -f docker-compose.dev.yml up -d`
3. Visit http://localhost:8080

Both backend and frontend will automatically reload whenever you edit the API server code (api-server/) and the React code (frontend/).

## Tech stack

This project is build with the following technologies:

 * Python 3, Django (+ django-rest-framework) for the backend
 * React with Nextjs for the frontend (+ Tailwind CSS)

I went with Django because it's a robust and mature framework for web development.

I picked Nextjs and Tailwind to gain practical experience in working with them, while not totally convinced yet about their usefulness.
