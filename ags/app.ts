import { App } from "astal/gtk3"
import style from "./style.css"
import Bar from "./widget/Bar"
import MainBar from "./widget/MainWIndow"
import MediaWindow from "./widget/widgets/media/MediaWIndow"
import CalendarWindow from "./widget/widgets/clock/CalendarWindow"
import { TrailWindow } from "./widget/widgets/trail/Systrail"
import NotificationPopups from "./widget/widgets/notification/NotificationPopups"
import { MixerWindow } from "./widget/widgets/audio_mixer/AudioMixer"

App.start({
    css: style,
    icons: "/home/enki/enki-dots/icons",
    main() {
        CalendarWindow()
        MainBar(0)
        MediaWindow()
        TrailWindow()
        MixerWindow()
        NotificationPopups()
        
        // Bar(1) // initialize other monitors
    },
})
