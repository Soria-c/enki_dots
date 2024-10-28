import Notifd from "gi://AstalNotifd"
import { bind, Variable } from "astal"
import { App, Astal, Gtk, Widget } from "astal/gtk3"
import Pango from "gi://Pango?version=1.0"

const notifications = Notifd.get_default()
const notification_map = Variable<{[key:string]: {[key: string]: any}}>({})
const not_time = 3000



function NotificationIcon(app_entry:string, app_icon:string, image:string) {
  if (image) {
    print("img")
    print(image)
    let icss = `background-image: url("${image}");`
                + "background-size: contain;"
                + "background-repeat: no-repeat;"
                + "background-position: center;";
    return (
        <box css={icss}>

        </box>
    )
  }
  return (
    <box>
        <icon icon={app_icon}
              css="font-size: 65px"/>
    </box>
  )
    // let icon = "dialog-information-symbolic"
    // if (Utils.lookUpIcon(app_icon))
        // icon = app_icon

}

function Notification(app_name: string, swtch: Variable<boolean>) {
    const not_hover = Variable(true)
    const progress_class = Variable("show-progress")

    const Icon = () => {
        return (
            <box valign={Gtk.Align.START}
                 className="icon"
                 setup={self => {
                    function update() {
                        let not = notification_map.get()[app_name]
                        if (self.child == null ) {

                            self.child = NotificationIcon(not.app_entry, not.app_icon, not.image)
                        } else {
                            let ch: Widget.Box = self.child as Widget.Box
                            if (ch.child) {
                                (ch.child as Widget.Icon).icon = not.app_icon
                            } else {
                                self.child = NotificationIcon(not.app_entry, not.app_icon, not.image)
                            }
                            
                        }
                    }
                    self.hook(notification_map, update)
                 }}>

            </box>
        )
    }

    const Title = () => {
        return (
            <label className="title"
                   xalign={0}
                   justify={Gtk.Justification.LEFT}
                   hexpand={true}
                   maxWidthChars={24}
                   truncate={true}
                   ellipsize={Pango.EllipsizeMode.END}
                   wrap={true}
                   useMarkup={true}
                   setup={(self) => {
                    function update() {
                        self.label = notification_map.get()[app_name].summary
                    }
                    self.hook(notification_map, update)
                   }}/>
        )
    }

    const Body = () => {
        return (
            <label className="body"
                   hexpand={true}
                   useMarkup={true}
                   xalign={0}
                   justify={Gtk.Justification.LEFT}
                   wrap={true}
                   setup={self => {
                    function update() {
                        self.label = notification_map.get()[app_name].body
                    }
                    self.hook(notification_map, update)
                   }}/>
        )
    }

    const Actions = () => {
        return (
            <box className="actions"
                 setup={(self) => {
                    function update() {
                        self.children = notification_map.get()[app_name].actions?.map(({ id, label }: {id: string, label: string}) => {
                            return (
                                <button className="action-button"
                                        onClick={() => {
                                            notification_map.get()[app_name].invoke(id)
                                            notification_map.get()[app_name].dismiss()
                                        }}
                                        hexpand={true}>
                                    <label label={label}/>
                                </button>
                            )
                        })
                    }
                    self.hook(notification_map, update)
                 }}/>
        )
    }

    const ProgressBar = () => {
        return (
            <box className="progress_container">
                <box className="progress_box"
                     css="min-width: 0px;margin-right: -250px;"
                    //  css="min-width: 0px;"
                     setup={(self) => {
                        if (not_hover.get()) {
                            setTimeout(() => {
                                // self.css = "min-width: 250px;"
                                self.css = "margin-right: 0px;"
                            },)
                        }
                     }}/>
            </box>
        )
    }

    return (
        <eventbox onHover={() => {
                    clearTimeout(notification_map.get()[app_name].timeout)
                    // clearInterval(notification_map.value[app_name]["progress"])
                    notification_map.get()[app_name]["hover"] = true
                    not_hover.set(false)
                    progress_class.set("hide-progress")
                  }}
                  onHoverLost={() => {
                    notification_map.get()[app_name].widget?.destroy() 
                    // clearInterval(notification_map.value[app_name]["progress"])
                    delete  notification_map.get()[app_name]
                  }}>
            <box className={`notification ${notification_map.get()[app_name].urgency}`}
                 vertical={true}
                 spacing={2}
                 setup={(self) => {
                    function update() {
                        self.className = `notification ${notification_map.get()[app_name].urgency}`
                        // self.class_name = "not-container"
                    }
                    self.hook(notification_map, update)
                 }}>
                <box spacing={8}>
                    <Icon />
                    <box vertical={true}>
                        <Title />
                        <Body />
                    </box>
                    <icon className="icon"
                          hexpand={true}
                          vexpand={true}
                          halign={Gtk.Align.END}
                          valign={Gtk.Align.START}
                          icon={app_name}/>
                </box>
                <Actions />
                <box className={bind(progress_class)}
                     setup={self => {
                        function update() {
                            print("sww")
                            self.child?.destroy()
                            self.child = <ProgressBar />
                        }
                        self.hook(swtch, update)
                     }}/>
            </box>
        </eventbox>
    )
}

export default function NotificationPopups() {
    const list = (
        <box vertical={true}>
            
        </box>
    )

    function onNotified(_:any, id:any) {``
        const n = notifications.get_notification(id)
        // print("on notified")
        // print(n)
        if (n) {
            // print("app name")
            // print(n.get_app_name())
            let not = {}
            if (!(n.get_app_name() in notification_map.get())) {
                let swtch = Variable(false)
                notification_map.set({...notification_map.get(), 
                    [n.get_app_name()]: {swtch: swtch, hover: false}
                })
                let not_widget = Notification(n.get_app_name(), swtch)

                not = {
                    "widget": not_widget,
                };
                (list as Widget.Box).add(not_widget)
                list.show_all()

            }
            notification_map.set({...notification_map.get(), 
                [n.app_name]: {
                    ...not,
                    ...notification_map.get()[n.get_app_name()],
                    "summary": n.summary,
                    "body": n.body,
                    "actions": n.get_actions(),
                    "id": n.id,
                    "dismiss": n.dismiss,
                    "app_entry": n.desktopEntry,
                    "app_name": n.app_name,
                    "app_icon": n.app_icon,
                    "urgency": n.urgency,
                    "image": n.image,
                    "invoke": n.invoke,
                    
                }
            })
            if (!notification_map.get()[n.get_app_name()]["hover"]) {
                // clearInterval(notification_map.value[n.app_name]["progress"])
                clearTimeout(notification_map.get()[n.get_app_name()].timeout)
                // clearInterval(notification_map.value[n.app_name].progress)
                // setInterval(() => {
                //     notification_map.value[n.app_name].progress.value = notification_map.value[n.app_name].progress.value + (1/not_time)
                // }, 1)
                notification_map.get()[n.get_app_name() ]["swtch"].set(!notification_map.get()[n.get_app_name()]["swtch"].get())
                notification_map.get()[n.get_app_name() ].timeout = setTimeout(() => { 
                    // clearInterval(notification_map.value[n.app_name].progress)
                    notification_map.get()[n.app_name].widget?.destroy()
                    
                    delete  notification_map.get()[n.app_name]
                }, not_time)
            }
        }

    }

    function onDismissed(_:any, id:any) {
        // print("dismiss")
        // print(list.children.length)
        // list.children.find(n => n.attribute.id === id)?.destroy()
        // print(list.children.length)
    }

    (list as Widget.Box).hook(notifications, "notified", onNotified)
        .hook(notifications, "resolved",onDismissed);
    
    return (
        <window monitor={0}
                name="notifications0"
                className="notification-popups"
                layer={Astal.Layer.OVERLAY}
                anchor={Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.LEFT}>
            <box css="min-width: 2px; min-height: 2px;"
                 className="notifications"
                 vertical={true}
                 child={list}>
                
            </box>
        </window>
    )


}