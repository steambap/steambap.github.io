---
title: "Boardgame.io React Client Workaround"
pubDate: "2023-06-15"
description: "My thoughts on using boardgame.io"
---

## Boardgame.io
Boardgame.io is an open-source state management and multiplayer networking solution for turn-based games.

## The Good Part
Compared to other game frameworks that focus on graphics and physics, boardgame.io focuses on turn-based games, where you can simply define a few rules for players and how to render things like the board, pieces, and the winning screen. It is really easy to create something functional that can be played and debugged immediately.

If you want to make chess, you just define the board, how pieces can be moved, set the maximum number of moves to 1, and the winning conditions. The rest is just how to render the current board state.

## The Bad Part
As the title suggests, it focuses on multiplayer networking. If you want to create a single-player game like me, you might face challenges. First, there is no way to set the starting variables without a backend. If you want some randomness at game start, you have to figure out a workaround. Second, their official React client is not very React-friendly. You have to call a function with your board definition to return a React class that does not accept children props. This makes it difficult to embed in a React app and forces you to write your entire app inside their wrapper.

## Workaround
The workaround is to create a raw client and pass the state around via React context:

```ts
// I'm using TypeScript, so importing some definitions
import { Client as RawClient } from "boardgame.io/client";
// ...other imports

// React component
function App() {
  // _ClientImpl<G> in the original boardgame.io React client
  const client = useRef<ReturnType<typeof RawClient<IG>> | null>(null);
  // Force update when the client notifies us about changes
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
    // Subscribe for updates
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

  // Render loading component when the client is not ready
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
        {/* Your board goes here, and everything downstream can access the state via context */}
        <Board />
        {/* You can also include other React components here or inside the outer div */}
      </bgioContext.Provider>
    </div>
  );
}
```

## Conclusion
If I were starting a new turn-based single-player game today, I would probably just copy some of their client-side code as the framework instead of using it directly. The codebase is relatively unmaintained, and some parts are outdated, like the class-based React client.
