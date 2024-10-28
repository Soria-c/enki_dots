import Hyprland from "gi://AstalHyprland"
import Gdk from "gi://Gdk?version=3.0";
import { bind } from "astal"
import { Widget } from "astal/gtk3"

const hyprland = Hyprland.get_default()

const dispatch = (ws: string) => hyprland.message_async(`dispatch workspace ${ws}`, ()=>{});
// const actions = {
//     [Gdk.ScrollDirection.UP]: dispatch('+1'),
//     [Gdk.ScrollDirection.DOWN]: dispatch('-1')
// }

const numbers: {[key: number]: string} = {
    1: "\u0661",
    2: "\u0662",
    3: "\u0663",
    4: "\u0664",
    // 4: "۴",
    // 5: "\u0665",
    5: "۵",
    // 6: "\u0666",
    6: "۶",
    7: "\u0667",
    8: "\u0668",
    9: "\u0669",
    10: "\u0661\u0660",
}

function setClass(active: number, index: number) {
    return () => {
        if (active == index) {
            return "focused"
        }
        else if (hyprland.get_clients().find(c => c.workspace.id == index) !== undefined){
            return "unfocused"
        } else {
            return "unused"
        }
    }
}
function setUP(self: Widget.Box) {
    self.hook(hyprland, "workspace-added",(a,b, c, D) => self.children.forEach(btn => {
        let active = hyprland.get_monitor(0).get_active_workspace().id
        let child = (btn as Widget.Box)

        let id = Number(btn.name)
        if ( (active != id) && (id == b.id)){
            child.className = "unfocused"
        } 
    },))    
    .hook(hyprland, "workspace-removed",(_,b) => self.children.forEach(btn => {
        let active = hyprland.get_monitor(0).get_active_workspace().id
        let child = (btn as Widget.Box)
        let id = Number(btn.name)
        if ( (active != id) && (id == b)){
            child.className = "unused"
        } 
    },))
}

export default function Workspaces() {
    return (
        <eventbox 
        // onScroll={(_, event) => actions[event.direction]}
        >
            <box spacing={10}
                 className="component-box numbers"
                 setup={setUP}>
                {
                    Array.from({ length: 10 }, (_, i) => i + 1).map(i => {
                        // print(i)
                        return (
                            <label name={i.toString()}
                                   label={numbers[i]}
                                   className={bind(hyprland, "focusedWorkspace").as(active => setClass(active.id, i)())}
                                   />
                        )
                    })
                }
            </box>
        </eventbox>
    )
}