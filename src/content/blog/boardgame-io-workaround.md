---
title: "Boardgame.io React client workaround"
pubDate: "2023-06-15"
description: "My thought on using boardgame.io"
---

## Boardgame.io
Boardgame.io is an open source state management and multiplayer networking solution for turn-based games.

## The Good Part
Compare to other game framework that focus on graphic and physics, boardgame.io focus on turn-based game, where you can just define a few rules for player and how to render things like board, piece and winning screen. It is really easy to create something that is functional and can be played and debuged immediately.

If you want to make chess, then just defined the board, how piece can be moved, set max number of move to 1 and winning condition. Then the rest is just how to render the current board state.

## The Bad Part
As their title says, it is focus on multiplayer networking. If you want to create a single player game like me, then you are in trouble. First, there is no way to set the starting variable without backend. If you want to have some randomness at game start, you have to somehow workaround it. Second, their official React client is not very React friendly. You have to call a function with your board definition to return a React class that does not accept Children props. This makes it difficult to embed it in a React app and forces you to write your whole app inside their wrapper.

## Workaround
The workaround is to create a raw client and pass the state around via React context

```ts
// I'm using TypeScript, so importing some definition
import { Client as RawClient } from "boardgame.io/client";
// ...other imports

// React component
function App() {
  // _ClientImpl<G> in the original boardgame.io react client
  const client = useRef<ReturnType<typeof RawClient<IG>> | null>(null);
  // Force update when client notify us about changes
  const forceUpdate = useForceUpdate();
  // Boardgame client state
  const state = client.current?.getState?.();

  // Create client on mount
  useEffect(() => {
    if (client.current === null) {
      client.current = RawClient({
        game: gameConfig,
        numPlayers: 1,
        debug: false,
      });
    }
    // Subscription
    const unsubscribe = client.current.subscribe(() => forceUpdate());
    client.current.start();

    // Clean up on unmount
    return () => {
      if (client.current === null) {
        return;
      }
      client.current.stop();
      unsubscribe();
    };
  }, []);

  // Render loading component when client is not ready
  if (state == null) {
    return <div>Loading...</div>;
  }

  const value = {
    ...state,
    isMultiplayer: false,
    moves: client.current?.moves!,
    events: client.current?.events!,
    matchID: client.current?.matchID!,
    playerID: client.current?.playerID!,
    reset: client.current?.reset!,
    undo: client.current?.undo!,
    redo: client.current?.redo!,
    log: client.current?.log!,
    matchData: client.current?.matchData!,
    sendChatMessage: client.current?.sendChatMessage!,
    chatMessages: client.current?.chatMessages!,
  };

  return (
    <div className="App">
      <bgioContext.Provider value={value}>
        {/* Your board goes here and everything down stream can access state via context */}
        <Board />
        {/* Your can also have some other React component here or inside the outer div */}
      </bgioContext.Provider>
    </div>
  );
}
```


## Conclusion
If I'm starting a new turn-based single player game today, I'll probably just copy some of their client side code as the framework in stead of using it direcly. The code base is relatively unmaintained and some code is just too old like the class based React client.
