Route as state management is a powerful tool that allows you to manage the state
of your application in a predictable way. It is particularly useful in large
applications where managing state can become complex and difficult to maintain.

We use the search param for keep our state in sync with the URL. This allows us
to share the state with others and also to bookmark specific states of the
application.

This application keep in state the following information:

- Pagination
- Sorting
- Search query
- Which columns are visible
- Border style
- Color style

[Source code](https://github.com/ziv/angular-table-route-example)
