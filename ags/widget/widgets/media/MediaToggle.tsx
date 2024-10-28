import Mpris from "gi://AstalMpris"
import { bind, Variable } from "astal"
import { App, Widget } from "astal/gtk3"
import Pango from "gi://Pango?version=1.0"

export const player_stack = Variable<Mpris.Player[]>([])

export const cur_value = Variable<number>(0.0)
export const cur_p_status = Variable<Mpris.PlaybackStatus>(Mpris.PlaybackStatus.STOPPED)
export const cur_title = Variable<string>("")
export const cur_icon = Variable<string>("")


export const current = Variable(false)
export const playtoggle = Variable(false)
// player_stack.set([])

const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"

function get_play_status_icon(status: Mpris.PlaybackStatus) {
    switch (status) {
        case Mpris.PlaybackStatus.PLAYING:

            return PAUSE_ICON
        case Mpris.PlaybackStatus.PAUSED:
        case Mpris.PlaybackStatus.STOPPED:
            return PLAY_ICON
        default:
            return PLAY_ICON
    }
    // return ""
}

function setUp(self: Widget.Box) {
    // print("asd")
    function update() {
        // print("qwe")
        print(player_stack.get().length > 0)
        self.visible = player_stack.get().length > 0
    }
    self.hook(current, update)
}

function setUpCircular(self: Widget.CircularProgress) {
    function update() {
        // print(player_stack.value)
        let l = player_stack.get().length;
        if (l > 0) {
            // print("sd")
            let peek = player_stack.get()[l - 1];
            self.value = (peek.get_position() / peek.get_length()) - 0.25;
            // self.value = current.value.position /player_stack.value[player_stack.value.length - 1].length
            // if (self.child) (self.child as Widget.Icon).icon = get_play_status_icon(cur_p_status.get())
        }
    }
    self.hook(current, update)
}

function setUpLabel(self: Widget.Label) {
    function update() {

        if (player_stack.get().length > 0) {
            let track_title = player_stack.get()[player_stack.get().length - 1].title
            if (track_title) self.label = track_title
        }
    }
    self.hook(current, update)
}

function setIcon(self: Widget.Icon) {
    function update() {
        if (player_stack.get().length > 0) {
            self.icon = player_stack.get()[player_stack.get().length - 1].identity
        }
    }
    self.hook(current, update)
}


export default function MediaToggle() {
    return (
        <box 
            // visible={false}
            // setup={setUp}
             visible={bind(player_stack).as(s => s.length > 0)}
             >
            <box spacing={6}
                 className="component-box media-box">
                <eventbox onClick={() => {
                            if (player_stack.get()[player_stack.get().length - 1].playbackStatus == Mpris.PlaybackStatus.PLAYING) playtoggle.set(true)
                            player_stack.get()[player_stack.get().length - 1].play_pause()
                            }}>
                    <circularprogress className="media_cir"
                                      rounded={false}
                                      inverted={false}
                                      startAt={0.75}
                                      value={bind(cur_value).as(s => {
                                        return s - 0.25
                                      })}
                                      setup={setUpCircular}
                                      >
                        <icon css="font-size: 10px" icon={bind(current).as(a => {
                                if (player_stack.get().length > 0) {
                                    // print("sdf")
                                    return get_play_status_icon(player_stack.get()[player_stack.get().length - 1].playbackStatus)
                                }
                                return PLAY_ICON
                        })}/>
                    </circularprogress>
                </eventbox>
                
                <eventbox onClick={() => App.toggle_window("media-0")}>
                    <box spacing={6}>
                        <label className="words"
                               maxWidthChars={18}
                               truncate={true}
                               ellipsize={Pango.EllipsizeMode.MIDDLE}
                            //    label={bind(cur_title).as(t => {
                            //     print(t)
                            //     return t
                            //    })}
                               setup={setUpLabel}
                               />
                        <icon setup={setIcon} />
                    </box>
                </eventbox>
            </box>
        </box>
    )
}