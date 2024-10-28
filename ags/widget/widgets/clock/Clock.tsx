import { bind, Variable } from "astal"
import { App, } from "astal/gtk3"

const date = Variable("").poll(1000, 'date "+%H:%M:%S, %a %d/%m/%y "')

export default function Clock() {
    const d = bind(date)

    return (
        <eventbox onClick={() => App.toggle_window("calendar-window")}
                //   onHoverLost={() => App.toggle_window("calendar-window")}
                  >
            <centerbox className="component-box date">
                <box />
                <box spacing={2}>
                    <box className="clock">
                        <icon icon="clock-color-icon"/>
                        <label label={d.as(c => {
                            if (c == "") {
                                return ""
                            }
                            return " " + c.split(",")[0]
                        })}/>
                    </box>
                    <box>
                        <icon icon="calendar_icon"/>
                        <label label={d.as(c => {
                            if (c == "") {
                                return ""
                            }
                            return c.split(",")[1]
                        })}/>
                    </box>
                </box>
                <box />
            </centerbox>
        </eventbox>
    )
}