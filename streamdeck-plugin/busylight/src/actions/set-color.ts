import streamDeck, { action, JsonObject, KeyDownEvent, DidReceiveSettingsEvent, PropertyInspectorDidAppearEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "org.igox.busylight.color.set" })
export class SetColor extends SingletonAction {
   override async onKeyDown(ev: KeyDownEvent<ColorSettings>): Promise<void> {

        streamDeck.logger.debug(`>>> Received KeyDownEvent. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);

        const { settings } = ev.payload;
        settings.color ??= '#FFFFFF';
        setColor(hexToRgb(settings.color));
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<ColorSettings>): Promise<void> {
            
        streamDeck.logger.debug(`>>> Received onDidReceiveSettings. Settings: ${JSON.stringify(ev.payload.settings)} <<<`);
            
        const { settings } = ev.payload;
        await ev.action.setSettings(settings);
    }

    override async onPropertyInspectorDidAppear(ev: PropertyInspectorDidAppearEvent<ColorSettings>): Promise<void> {
        streamDeck.logger.debug(`>>> Color button property inspector diplayed! <<<`);
                
        await ev.action.setImage(`imgs/actions/buttons/colored/colored.png`);
	}
}

function hexToRgb(hex: string): { r: number, g: number, b: number } {
    const hexNumber = parseInt(hex.replace('#', ''), 16);
    const r = (hexNumber >> 16) & 255;
    const g = (hexNumber >> 8) & 255;
    const b = hexNumber & 255;
    return { r, g, b };
}

async function setColor(color: JsonObject) {
    const settings = await streamDeck.settings.getGlobalSettings();
    const url = settings.url;

    streamDeck.logger.debug(`>>> Sending color: ${JSON.stringify({"r": color.r, "g": color.g, "b": color.b})} to ${url} <<<`);

    fetch(`${url}/api/color`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"r": color.r, "g": color.g, "b": color.b})
        })
        .then(response => response.json())
        .then(data => streamDeck.logger.debug(data));
}

type ColorSettings = {
	color?: string;
};