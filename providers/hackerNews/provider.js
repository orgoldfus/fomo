const axios = require("axios")
const API_URL = "https://hacker-news.firebaseio.com"

async function _getBestStoriesIds() {
  const response = await axios.get(
    `${API_URL}/v0/beststories.json?print=pretty`
  )
  return response.data
}

async function getBestStories(numOfStories) {
  const bestStoriesIds = await _getBestStoriesIds()
  const topXIds = bestStoriesIds.slice(0, numOfStories)

  const topStoriesPromises = topXIds.map((id) =>
    axios.get(`${API_URL}/v0/item/${id}.json?print=pretty`)
  )

  const rawResponse = await Promise.all(topStoriesPromises)
  return rawResponse.map((story) => {
    const data = story.data

    return {
      id: data.id,
      score: data.score,
      date: new Date(data.time * 1000).toISOString(),
      title: data.title,
      url: data.url || `https://news.ycombinator.com/item?id=${data.id}`
    }
  })
}

module.exports = {
  getBestStories
}
