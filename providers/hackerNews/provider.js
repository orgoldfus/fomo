const axios = require("axios")

const API_URL = "https://hacker-news.firebaseio.com"
const fetchTypes = {
  BEST: "best",
  TOP: "top",
  NEW: "new",
  ASK: "ask",
  SHOW: "show",
  JOBS: "jobs"
}

async function getStories(numOfStories, type) {
  const storiesIds = await _getStoriesIdsByType(type)
  const topXIds = storiesIds.slice(0, numOfStories)

  const storiesPromises = topXIds.map((id) =>
    axios.get(`${API_URL}/v0/item/${id}.json`)
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
    [fetchTypes.BEST]: 'v0/beststories.json',
    [fetchTypes.TOP]: 'v0/topstories.json',
    [fetchTypes.NEW]: 'v0/newstories.json',
    [fetchTypes.ASK]: 'v0/askstories.json',
    [fetchTypes.SHOW]: 'v0/showstories.json',
    [fetchTypes.JOBS]: 'v0/jobstories.json',
  }

  const getIdsUrl = typeToUrlMap[type]
  const response = await axios.get(`${API_URL}/${getIdsUrl}`)

  return response.data
}

module.exports = {
  getStories,
  fetchTypes
}
