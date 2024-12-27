import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "org.igox.busylight.status.available" })
export class SetStatusAvailable extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent): Promise<void> {      
        setStatus('available');
    }
}

@action({ UUID: "org.igox.busylight.status.busy" })
export class SetStatusBusy extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent): Promise<void> {
        setStatus('busy');
    }
}

@action({ UUID: "org.igox.busylight.status.away" })
export class SetStatusAway extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent): Promise<void> {
        setStatus('away');
    }
}

@action({ UUID: "org.igox.busylight.status.off" })
export class SetStatusOff extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent): Promise<void> {
        setStatus('off');
    }
}

async function setStatus(status: string) {
    const settings = await streamDeck.settings.getGlobalSettings();
    const url = settings.url;

    streamDeck.logger.trace(`>>> Sending status: ${status} to ${url} <<<`);

    fetch(`${url}/api/status/${status}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => streamDeck.logger.trace(data));
}