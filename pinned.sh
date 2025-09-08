#!/usr/bin/env bash

pinned() {
	gh api graphql -f query='
query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          owner {
            login
          }
          description
          url
          stargazerCount
          primaryLanguage { name }
        }
      }
    }
  }
}
' -F login='fibonacid' --jq '.data.user.pinnedItems.nodes'
}

pinned >pinned.json
