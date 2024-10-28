import GObject from "gi://GObject"
import { Gtk, Gdk, Astal, Widget, astalify, type ConstructProps, App } from "astal/gtk3"

export class CalendarBase extends astalify(Gtk.Calendar) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        CalendarBase,
        Gtk.Calendar.ConstructorProps,
        { onColorSet: [] } // signals of Gtk.ColorButton have to be manually typed
    >) {
        super(props as any)
    }
}


function Calendar() {
    return (
        <CalendarBase />
    )
}

export default function CalendarWindow() {
    return (
        <window name="calendar-window"
                application={App}
                anchor={Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.RIGHT}
                    visible={false}
                    marginRight={5}
                    marginTop={5}
                    marginBottom={0}
                    keymode={Astal.Keymode.ON_DEMAND}>
            <eventbox onHoverLost={()=> App.toggle_window("calendar-window")}>
                <CalendarBase />

            </eventbox>
        </window>
    )
}