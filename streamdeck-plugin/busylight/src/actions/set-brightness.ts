import streamDeck, { action, DidReceiveSettingsEvent, WillAppearEvent, KeyDownEvent, PropertyInspectorDidAppearEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "org.igox.busylight.brigthness.set" })
export class SetBrightness extends SingletonAction<BrightnessSettings> {
    
    override async onKeyDown(ev: KeyDownEvent<BrightnessSettings>): Promise<void> {

        streamDeck.logger.debug(`>>> Received KeyDownEvent. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);

        const { settings } = ev.payload;
        settings.brightness ??= 40;
        setBrightness(settings.brightness);
    }

    override onWillAppear(ev: WillAppearEvent<BrightnessSettings>): void | Promise<void> {
        
        streamDeck.logger.debug(`>>> Received WillAppearEvent. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);

        return ev.action.setTitle(`${ev.payload.settings.brightness ?? 40}%`);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BrightnessSettings>): Promise<void> {
        
        streamDeck.logger.debug(`>>> Received onDidReceiveSettings. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);
        
        const { settings } = ev.payload;
        await ev.action.setSettings(settings);
		await ev.action.setTitle(`${settings.brightness}%`);
    }

    override async onPropertyInspectorDidAppear(ev: PropertyInspectorDidAppearEvent<BrightnessSettings>): Promise<void> {
        streamDeck.logger.debug(`>>> Received onPropertyInspectorDidAppear. Setting action icon <<<`);
                
        await ev.action.setImage(`imgs/actions/buttons/brigthness/brigthness.png`);
    }
}

async function setBrightness(brightness: number) {
    const settings = await streamDeck.settings.getGlobalSettings();
    const url = settings.url;

    streamDeck.logger.debug(`>>> Sending brightness: ${brightness} to ${url} <<<`);

    fetch(`${url}/api/brightness`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"brightness": brightness/100})
        })
        .then(response => response.json())
        .then(data => streamDeck.logger.debug(data));
}

type BrightnessSettings = {
	brightness?: number;
};
