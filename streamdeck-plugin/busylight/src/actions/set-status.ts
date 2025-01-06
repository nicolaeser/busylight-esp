import streamDeck, { action, KeyDownEvent, SingletonAction, DidReceiveSettingsEvent } from "@elgato/streamdeck";

@action({ UUID: "org.igox.busylight.status.set" })
export class SetStatus extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent<statusSettings>): Promise<void> { 
        const { settings } = ev.payload;
        settings.status ??= 'available';
        setStatus(settings.status);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<statusSettings>): Promise<void> {
        const { settings } = ev.payload;
        let status = settings.status;
        streamDeck.logger.debug(`>>> Config status changed to: ${status} <<<`);
        
        await ev.action.setImage(`imgs/actions/buttons/${status}/${status}.png`);

	}
}

async function setStatus(status: string) {
    const settings = await streamDeck.settings.getGlobalSettings();
    const url = settings.url;

    streamDeck.logger.debug(`>>> Sending status: ${status} to ${url} <<<`);

    fetch(`${url}/api/status/${status}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => streamDeck.logger.debug(data));
}

type statusSettings = {
	status?: string;
};