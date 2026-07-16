import "./App.css";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function App() {
  return (
    <>
    <header>
    <Show when="signed-out">
      <SigInButton mode="modal" />
      <SignUpButton mode="modal" />
      </Show>
      <Show when="signed-in">
        <UserButton />
        </Show>
      </header>
     </>
  );
}

export default App;