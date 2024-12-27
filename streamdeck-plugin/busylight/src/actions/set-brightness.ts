import streamDeck, { action, DidReceiveSettingsEvent, WillAppearEvent, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "org.igox.busylight.brigthness.set" })
export class SetBrightness extends SingletonAction<BrightnessSettings> {
    
    override async onKeyDown(ev: KeyDownEvent<BrightnessSettings>): Promise<void> {

        streamDeck.logger.trace(`>>> Received KeyDownEvent. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);

        const { settings } = ev.payload;
        settings.brightness ??= 40;
        setBrightness(settings.brightness);
    }

    override onWillAppear(ev: WillAppearEvent<BrightnessSettings>): void | Promise<void> {
        
        streamDeck.logger.trace(`>>> Received WillAppearEvent. Settings: ${JSON.stringify(ev.payload.set)} <<<`);

        return ev.action.setTitle(`${ev.payload.settings.brightness ?? 40}%`);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BrightnessSettings>): Promise<void> {
        
        streamDeck.logger.trace(`>>> Received onDidReceiveSettings. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);
        
        const { settings } = ev.payload;
        await ev.action.setSettings(settings);
		await ev.action.setTitle(`${settings.brightness} %`);
    }
}

async function setBrightness(brightness: number) {
    const settings = await streamDeck.settings.getGlobalSettings();
    const url = settings.url;

    streamDeck.logger.trace(`>>> Sending brightness: ${brightness} to ${url} <<<`);

    fetch(`${url}/api/brightness`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"brightness": brightness/100})
        })
        .then(response => response.json())
        .then(data => streamDeck.logger.trace(data));
}

type BrightnessSettings = {
	brightness?: number;
};
