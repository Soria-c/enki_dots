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
import MixerToggle from "./widgets/audio_mixer/MixerToggle"



// print(audio.default_speaker.volume)
// const time = Variable("").poll(1000, "date")

import Wp from "gi://AstalWp"

const wp = Wp.get_default()
// print("default speaker")
// print(wp?.audio.default_speaker.get_description())
// print("streams")
// print(wp?.audio.streams)
// wp?.connect("", (a,b) => {
//     print("enbddsys")
//     print(b.get_description())
// })

// wp!.audio.connect("stream-added", (a,b) => {
//     print("streams")
//     // print(a)
//     print(b.get_description())
//     // print(b.get_volume())
//     print()
// })

// wp!.audio.connect("microphone-added", (a,b) => {
//     print("mics")
//     // print(a)
//     print(b.get_description())
//     print()
// })

// wp!.audio.connect("speaker-added", (a,b) => {
//     print("speakers")
//     // print(a)
//     print(b.get_description())
//     print(b.get_is_default())
//     print()
// })

// wp!.audio.connect("device-added", (a,b) => {
//     print("devices")
//     // print(a)
//     print(b.get_description())
//     print()
// })

// wp!.audio.connect("recorder-added", (a,b) => {
//     print("recorders")
//     // print(a)
//     print(b.get_description())
//     print()
// })




export default function MainBar(monitor: number) {
    return (
    <window className="Bar"
            monitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={
                Astal.WindowAnchor.TOP
                | 
                Astal.WindowAnchor.LEFT
                | Astal.WindowAnchor.RIGHT
                // | Astal.WindowAnchor.TOP
            }
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
                    <MixerToggle />
                    {/* <CalendarBase /> */}
                </box>

       

                {/* <box spacing={9} >
                    <label label="asdsad"></label>
                </box> */}
        </centerbox>
    </window>
    )
}