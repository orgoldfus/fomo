const axios = require("axios")
const API_URL = "https://hacker-news.firebaseio.com"
const fetchTypes = {
  BEST: "best",
  TOP: "top",
  NEW: "new"
}

async function getStories(numOfStories, type) {
  const storiesIds = await _getStoriesIdsByType(type)
  const topXIds = storiesIds.slice(0, numOfStories)

  const storiesPromises = topXIds.map((id) =>
    axios.get(`${API_URL}/v0/item/${id}.json?print=pretty`)
  )

  const rawResponse = await Promise.all(storiesPromises)
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

async function _getStoriesIdsByType(type) {
  const typeToUrlMap = {
    [fetchTypes.BEST]: 'v0/beststories.json?print=pretty',
    [fetchTypes.TOP]: 'v0/topstories.json?print=pretty',
    [fetchTypes.NEW]: 'v0/newstories.json?print=pretty',
  }

  const getIdsUrl = typeToUrlMap[type]
  const response = await axios.get(`${API_URL}/${getIdsUrl}`)

  return response.data
}

module.exports = {
  getStories,
  fetchTypes
}
