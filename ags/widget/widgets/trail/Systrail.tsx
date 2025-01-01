import GObject from "gi://GObject"
// import { Gtk, Gdk, Astal, Widget, astalify, type ConstructProps, App } from "astal/gtk3"
import Tray from "gi://AstalTray"
import { bind } from "astal"
// import { MenuButton } from "astal/src/gtk3/widget"
import Gtk from "gi://Gtk?version=3.0"
import { ConstructProps } from "astal/src/gtk3/astalify"
import { App, Astal, astalify } from "../../../../../../../usr/share/astal/gjs/gtk3"
import { MenuButton } from "../../../../../../../usr/share/astal/gjs/gtk3/widget"
import AstalTray from "gi://AstalTray"
// import AstalTray from "gi://AstalTray?version=0.1"

const tray = Tray.get_default()

const trailItems: {[key: string]: Gtk.Widget} = {}

class FlowBox extends astalify(Gtk.FlowBox) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        FlowBox,
        Gtk.FlowBox.ConstructorProps,
        { onColorSet: [] } // signals of Gtk.ColorButton have to be manually typed
    >) {
        super(props as any)
    }
}




function TrailItem(trayItem: AstalTray.TrayItem) {
    // let menu = trayItem.create_menu();
    return (
        // <menu
        <menubutton 
        className="trail-button"
        // tooltipMarkup={trayItem.title || trayItem.tooltip.title}
        // onClick={(_, event) => {
        //     // trayItem.activate(event.x, event.y)
        //     if (event.button == Astal.MouseButton.PRIMARY) {
        //         // print("qweqwsdsde")
        //         print(trayItem.title)
        //         trayItem.activate(event.x, event.y)
        //         App.toggle_window("trail_window")
        //     } else if (event.button == Astal.MouseButton.SECONDARY) {
        //         // print("qweqwsdsdfdfdfde")
        //         print(trayItem.get_is_menu())
        //         print(trayItem.title)
        //         // menu?.popup_at_pointer(null)
        //         // trayItem.secondary_activate(event.x, event.y)
        //         // App.toggle_window("trail_window")

        //     }
        // }}

        tooltipMarkup={bind(trayItem, "tooltipMarkup")}
        usePopover={false}
        actionGroup={bind(trayItem, "action-group").as(ag => ["dbusmenu", ag])}
        menuModel={bind(trayItem, "menu-model")}
        
        >
        {/* <icon icon={bind(trayItem, 'iconName').as((name) => name ?? '')}
            pixbuf={bind(trayItem, 'iconPixbuf').as(pxbf => pxbf ?? "")}
            /> */}
        <icon gIcon={bind(trayItem, "gicon")} />
    </menubutton>
    )
}

export default function SysTray() {
    return (
        
        <centerbox className="component-box trail">
            <box />
            <eventbox halign={Gtk.Align.CENTER}
                      cursor={"pointer"}
                      onClick={(self) => {
                        // self.toggleClassName("trail-open")
                        // (self.child as Widget.Icon).toggleClassName("trail-open")
                        App.toggle_window("trail_window");
                        // (self.child as Widget.Icon).toggleClassName("trail-open")
                        
                      }}>
                    <icon icon="down_arrow"/>
            </eventbox>
            <box />
        </centerbox>
    )
}

export function TrailWindow() {
    // let f = FlowBox.new()
    
    return (
        <window name="trail_window"
                className="component-box"
                
                monitor={0}
                exclusivity={Astal.Exclusivity.EXCLUSIVE}
                anchor={Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.RIGHT}
                application={App}
                // marginLeft={151}
                marginRight={200}
                marginTop={5}
                visible={false}
                // keymode={Astal.Keymode.ON_DEMAND}
                // marginBottom={0}
                
                >
            <eventbox onHoverLost={()=> App.toggle_window("trail_window")}>
                <FlowBox maxChildrenPerLine={4}
                        minChildrenPerLine={2}
                        selectionMode={0}
                        setup={self => {

                            function update(its: any, a:string) {
                                // print(a)
                                if (a) {
                                    let trayItem: AstalTray.TrayItem = tray.get_item(a);
                                    print(trayItem.title)
                                    let item = TrailItem(trayItem)
                                    trailItems[a] = item
                                    self.insert(item, 0)

                                }
                            }

                            function update2(_:any, b:any) {
                                self.remove(trailItems[b])
                                delete trailItems[b]
                            }

                            self.hook(tray, "item-added", update)
                            self.hook(tray, "item-removed", update2)
                        }}
                        >
                </FlowBox>
            </eventbox>
        </window>
    )
}


