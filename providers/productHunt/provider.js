const axios = require("axios")
const { get } = require("lodash")
const API_URL = "https://api.producthunt.com/v2/api/graphql"

async function getTop(numOfPosts = 10, cursor) {
  const query = `query ($count: Int!, $fromDate: DateTime!, $after: String) {
    posts(first: $count, order: VOTES, postedAfter: $fromDate, after: $after) {
      edges {
        node {
          name
          description
          votesCount
          website
        }
        cursor
      }
    }
  }`

  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - 14) // last two weeks

  const variables = {
    count: numOfPosts,
    fromDate: fromDate.toISOString(),
    after: cursor || ""
  }

  const result = await executePHRequest(query, variables)
  return buildPHResponse(result)
}

function getLatest(params) {}

async function executePHRequest(query, variables) {
  try {
    const response = await axios.post(
      API_URL,
      {
        query,
        variables
      },
      {
        headers: {
          Authorization: "Bearer _3NMUwQjYs-twKJiz12DYXeTvATJoO6wFAQxMA5Iy8c",
          "Content-Type": "application/json"
        }
      }
    )

    return response.data
  } catch (error) {
    console.error(error.message)
    return {}
  }
}

function buildPHResponse(queryResult) {
  const rawData = get(queryResult, "data.posts.edges", [])
  const data = rawData.map((post) => post.node)
  const cursor = rawData[rawData.length - 1].cursor

  return { data, cursor }
}

module.exports = {
  getTop
}
