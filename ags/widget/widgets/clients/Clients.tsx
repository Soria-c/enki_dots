import Hyprland from "gi://AstalHyprland"
import { bind, Variable } from "astal"

const hyprland = Hyprland.get_default()
const dispatch = (ws: number) => hyprland.message_async(`dispatch workspace ${ws}`, ()=>{});

let bad_clients: string[] = []

const vv = Variable(hyprland.get_clients())
hyprland.connect("client-added", (f,a)=> {
    print("client added")
    // let cl = hyprland.get_client(a.address)
    
    let cl = a
    if (cl != undefined ) {
        if (cl.class == "") {
            bad_clients.push(a.address)
        } else {
            vv.set(f.get_clients())
        }
    }
    
})
hyprland.connect("client-removed", (f, a)=> {
    print("cleint remove")
    let cl = hyprland.get_client(a)
    // let cl = a
    if (bad_clients.includes(a)) {
        bad_clients.splice(bad_clients.indexOf(a), 1)
    } else {
        vv.set(f.get_clients())
    }
})


export default function Clients() {
    const activeClient = bind(hyprland,  "focusedClient")

    return (
        <box spacing={8}
             className={bind(hyprland, "clients").as(p => {
                if (p.length > 0) {
                    return "component-box"
                } else {
                    return "hide-clients"
                }})}>
                {
                    bind(vv).as(a => a.sort((a,b) => {
                        if (a.get_workspace().get_id() < b.get_workspace().get_id()) return -1;
                        if (a.get_workspace().get_id() > b.get_workspace().get_id()) return 1;
                        return 0;  
                    }).map(i => {
                        return (
                            <eventbox onClick={()=> dispatch(i.get_workspace().get_id())}
                                      onHover={(self) => {
                                        if (self.className != "client-focused") self.className = "client-hover";
                                      }}
                                      onHoverLost={(self) => {
                                        if (self.className != "client-focused") self.className = "";
                                      }}
                                      className={activeClient.as(clnt => {
                                        if (clnt != null) {
                                            return `${clnt.address === i.address ? "client-focused" : ""}`
                                        }
                                        return ""
                                      })}>
                                <icon icon={i.class}/>
                            </eventbox>
                        )
                    }))
                }
        </box>
    )
}