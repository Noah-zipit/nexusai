{
  "headers": [
    {
      "source": "**/*",
      "headers": [
        { "key": "Content-Type", "value": "text/html" }
      ]
    }
  ],
  "rewrites": [
    { "source": "**", "destination": "/index.html" }
  ]
}
