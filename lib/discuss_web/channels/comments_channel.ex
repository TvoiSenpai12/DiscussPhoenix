defmodule DiscussWeb.CommentsChannel do
    use DiscussWeb, :channel
    alias Discuss.{Topic, Comment, Repo}

    def join("comments:" <> topic_id, _params, socket) do
        topic_id = String.to_integer(topic_id)
        topic = Repo.get(Topic, topic_id)

        {:ok, %{}, assign(socket, :topic, topic)}
    end

    def handle_in(name, %{"content" => content}, socket) do
    topic = socket.assigns.topic

    changeset =  topic
    |> Ecto.build_assoc(:comments)
    |> Comment.changeset(%{content: content})

    case Repo.insert(changeset) do
        {:ok, comment} ->
            {:reply, :ok, socket}
        {:error, _reason} ->
            {:reply, {:erorr, %{errors: changeset}}, socket}
            
    end
    end
end