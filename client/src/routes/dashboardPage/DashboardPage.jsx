import { useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";
import { useCreateChat } from "../../apiCalls/useCreateChat";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useCreateChat({
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>BALLONAI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            placeholder={
              mutation.isPending ? "Creating new chat..." : "Ask me anything..."
            }
            disabled={mutation.isPending}
            autoComplete="off" // This line disables autocomplete
            spellCheck="false" // This can also help reduce suggestions
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className={mutation.isPending ? "loading" : ""}
          >
            {mutation.isPending ? (
              <div className="spinner"></div>
            ) : (
              <img src="/arrow.png" alt="" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
