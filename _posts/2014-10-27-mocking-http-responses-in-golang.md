---
layout: post
title: "Mocking HTTP Responses in Golang"
description: "How to mock HTTP responses in a golang test suite using httptest.Server and http.Transport"
---

#### How to mock HTTP responses in a golang test suite using `httptest.Server` and `http.Transport`

---

I’ve been trying to hone my golang skills lately; this weekend I wanted to especially sharpen my testing chops. I decided to write a [simple package](https://github.com/keighl/mandrill) for sending emails via the [Mandrill API](https://mandrillapp.com/api/docs/messages.JSON.html) (which is the best transactional email platform out there, IMO). I wanted the package to send both regular messages and template-messages, and to have 90%+ test coverage.

Writing the mandrill interface was fairly trivial: `json.Marshal` some payload data, post it via an `http.Client`, and `json.Unmarshal` the response into some structs. However, testing it was much trickier.

I’m used to testing Ruby where mocking and stubbing is the name of the game. It’s really easy to adjust responses of object methods to cover your test cases. For instance, when writing an API wrapper like this one, I’d mock HTTP responses so the test suite doesn’t actually hit the API.

Golang isn’t as flexible at runtime, and that’s generally a bonus, but it makes mocking/stubbing non-trivial. In the test suite, I needed `http.Client.Post` to just return some static example JSON instead of making a true connection.

I Googled around for a while, and couldn’t find a clear example, but stumbled upon a few clues regarding `http.Transport`. It’s the interface that actually makes the connection between the client and the target web service.

It's the right spot to mock a response. The strategy involves:

* Dependency injecting an `http.Client` into the package methods
* Glomming all outgoing requests up in a custom `http.Transport`
* Rerouting the request to an ultra-basic `httptest.Server` that responds with the data and headers for the test

### The Package

{% highlight go %}
package mandrill

type Client struct {
  BaseURL string
  HTTPClient *http.Client
}

func (m *Client) MessagesSend(message *Message) (responses []*Response, apiError Error, err error) {

  payload, err := json.Marshal(message)
  if (err != nil) { return responses, apiError, err }

  resp, err := m.HTTPClient.Post(m.BaseURL+"messages.json", "application/json", bytes.NewReader(payload))
  if (err != nil) { return responses, apiError, err }

  defer resp.Body.Close()
  body, err := ioutil.ReadAll(resp.Body)
  if (err != nil) { return responses, apiError, err }

  if (resp.StatusCode >= 400) {
    apiError = &Error{}
    err = json.Unmarshal(body, apiError)
    return responses, apiError, errors.New(fmt.Sprintf("Status code: %i", resp.StatusCode))
  }

  responses = make([]*Response, 0)
  err = json.Unmarshal(body, &responses)
  return responses, apiError, err
}
{% endhighlight %}

### The Test

{% highlight go %}
package mandrill

func expect(t *testing.T, a interface{}, b interface{}) {
  if a != b {
    t.Errorf("Expected %v (type %v) - Got %v (type %v)", b, reflect.TypeOf(b), a, reflect.TypeOf(a))
  }
}

func Test_MessageSend_Success(t *testing.T) {

  // Test server that always responds with 200 code, and specific payload
  server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(200)
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintln(w, `[{"email":"bob@example.com","status":"sent","reject_reason":"hard-bounce","_id":"1"}]`)
  }))
  defer server.Close()

  // Make a transport that reroutes all traffic to the example server
  transport := &http.Transport{
    Proxy: func(req *http.Request) (*url.URL, error) {
      return url.Parse(server.URL)
    },
  }

  // Make a http.Client with the transport
  httpClient := &http.Client{Transport: transport}

  // Make an API client and inject
  client := &Client{server.URL, httpClient}

  // Test the method!
  responses, apiError, _ := m.MessagesSend(&Message{})

  correctResponse := &Response{
    Email: "bob@example.com",
    Status: "sent",
    RejectionReason: "hard-bounce",
    Id: "1",
  }

  expect(t, len(responses), 1)
  expect(t, reflect.DeepEqual(correctResponse, responses[0]), true)
}
{% endhighlight %}

### DRY It Out

In the test suite, I DRY’d out the whole thing to a fairly simple factory that returns a mock client, and server setup to respond with a specific status code and body.

{% highlight go %}

func testTools(code int, body string) (*httptest.Server, *Client)  {
  server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(code)
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintln(w, body)
  }))

  transport := &http.Transport{
    Proxy: func(req *http.Request) (*url.URL, error) {
      return url.Parse(server.URL)
    },
  }

  httpClient := &http.Client{Transport: transport}
  client := &Client{server.URL, httpClient}

  return server, client
}

func Test_MessageSend_Success(t *testing.T) {
  server, client := testTools(200, `[{"email":"bob@example.com","status":"sent","reject_reason":"hard-bounce","_id":"1"}]`)
  defer server.Close()

  //...
}

func Test_MessageSend_Fail(t *testing.T) {
  server, client := testTools(400, `{"status":"error","code":12,"name":"Unknown_Subaccount","message":"No subaccount exists with the id 'customer-123'"}`)
  defer server.Close()

  //...
}

{% endhighlight %}

Checkout my [mandrill package on github.](https://github.com/keighl/mandrill)