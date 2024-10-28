import { App, Astal, Widget } from "astal/gtk3"
import Media from "./Media"





export default function MediaWindow() {
    return (
        <window className="component-box"
                name= "media-0"
                monitor={0}
                visible={false}
                anchor={Astal.WindowAnchor.TOP
                       | Astal.WindowAnchor.RIGHT}
                application={App}
                marginTop={5}
                marginRight={220}
                // setup={w => w.key("Escape", () => App.closeWindow('media-0'))}
                >
                <Media />
        </window>
    )
}