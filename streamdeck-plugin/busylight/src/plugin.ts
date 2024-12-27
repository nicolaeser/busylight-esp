import streamDeck, { LogLevel, SingletonAction, action, type DidReceiveSettingsEvent } from "@elgato/streamdeck";

//import { IncrementCounter } from "./actions/increment-counter";
import { SetStatusAvailable, SetStatusBusy, SetStatusAway, SetStatusOff } from "./actions/set-status";
import { SetBrightness } from "./actions/set-brightness";
import { SetColor } from "./actions/set-color";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.INFO);

// Register the actions.
streamDeck.actions.registerAction(new SetStatusAvailable());
streamDeck.actions.registerAction(new SetStatusBusy());
streamDeck.actions.registerAction(new SetStatusAway());
streamDeck.actions.registerAction(new SetStatusOff());
streamDeck.actions.registerAction(new SetBrightness());
streamDeck.actions.registerAction(new SetColor());

// Finally, connect to the Stream Deck.
streamDeck.connect();
