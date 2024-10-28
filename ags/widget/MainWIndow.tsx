import { App, Astal, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import MenuLogo from "./widgets/MenuLogo"
import Metrics from "./widgets/metrics/Metrics"
import Workspaces from "./widgets/workspaces/Workspaces"
import Clients from "./widgets/clients/Clients"
import MediaToggle from "./widgets/media/MediaToggle"
import Clock from "./widgets/clock/Clock"
import { CalendarBase } from "./widgets/clock/CalendarWindow"
import SysTray from "./widgets/trail/Systrail"
import Bat from "./widgets/battery/Battery"

// const time = Variable("").poll(1000, "date")

export default function MainBar(monitor: number) {
    return (
    <window className="Bar"
            monitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={Astal.WindowAnchor.TOP
                | Astal.WindowAnchor.LEFT
                | Astal.WindowAnchor.RIGHT}
            application={App}
            marginLeft={10}
            marginRight={10}
            marginTop={2}
            marginBottom={0}
            >

        <centerbox hexpand={true}>
                <box spacing={10}>
                    <MenuLogo />
                    <Metrics />
                    <Workspaces />

                </box>
                <box spacing={10}>
                    <Clients />
                </box>
                <box spacing={9} halign={Gtk.Align.END}>
                    {/* <box css="min-width: 550px"></box> */}
                    <MediaToggle />
                    <SysTray />
                    <Clock />
                    <Bat />
                    {/* <CalendarBase /> */}
                </box>

       

                {/* <box spacing={9} >
                    <label label="asdsad"></label>
                </box> */}
        </centerbox>
    </window>
    )
}