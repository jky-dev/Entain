# Entain Take Home Task

## How it works

On load, page fetches the next 50 races from the API. From there, the races are checked on by their category and start time. If the start time was over 60 seconds ago or the category is not one of the three provided categories, it is excluded. The remaining races are then sorted by start time in ascending order.

Races are then filtered by selected categories, and then the first 5 races will be displayed. It is assumed that by fetching 50 races from the API, each category will have at least 5 races. If no categories are selected, there will be no races shown.

API is refetched each time a race is removed from the list. A race is removed from the list once it has started over 60 seconds ago. Every second, the site will check if a races need to be removed. If there are races to be removed, the site will remove them from view, and also refetch races from the API, incase all races had the same start time.

For each race shown, the meeting name and race number is displayed, alongside a countdown timer. The countdown timer shows how much time is left until the start of a race, or how long ago the race started.

## Building Locally

Tested with yarn 1.22.21 and node 20.11.1

Run `yarn dev` and navigate to http://localhost:5173/
