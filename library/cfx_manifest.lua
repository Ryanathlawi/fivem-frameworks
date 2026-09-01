---@meta
-- fxmanifest.lua / __resource.lua directives.
-- Hand-maintained, NOT generated: this is a fixed vocabulary from the Cfx.re
-- manifest reference, not something extracted from a framework repository.
-- https://docs.fivem.net/docs/scripting-reference/resource-manifest/resource-manifest/

---Manifest format this resource is written against. Always the first line.
---@param version 'cerulean' | 'bodacious' | 'adamant'
function fx_version(version) end

---Which game this resource targets.
---@param target 'gta5' | 'rdr3' | 'common'
function game(target) end

---Which games this resource targets.
---@param targets string[]
function games(targets) end

---Human-readable resource name.
---@param value string
function name(value) end

---What the resource does.
---@param value string
function description(value) end

---Who wrote it.
---@param value string
function author(value) end

---Resource version string.
---@param value string
function version(value) end

---License the resource is published under.
---@param value string
function license(value) end

---Where the source lives.
---@param value string
function repository(value) end

---Opt into Lua 5.4 instead of the default LuaJIT-flavoured 5.3.
---@param enabled 'yes' | 'no'
function lua54(enabled) end

---Script(s) that run on every client.
---@param path string | string[]
function client_script(path) end

---Script(s) that run on every client.
---@param paths string | string[]
function client_scripts(paths) end

---Script(s) that run on the server.
---@param path string | string[]
function server_script(path) end

---Script(s) that run on the server.
---@param paths string | string[]
function server_scripts(paths) end

---Script(s) that run on both sides.
---@param path string | string[]
function shared_script(path) end

---Script(s) that run on both sides.
---@param paths string | string[]
function shared_scripts(paths) end

---File(s) shipped to the client but not executed (NUI assets, data files).
---@param path string | string[]
function file(path) end

---File(s) shipped to the client but not executed (NUI assets, data files).
---@param paths string | string[]
function files(paths) end

---HTML entry point for this resource's NUI.
---@param path string
function ui_page(path) end

---A game data file this resource registers.
---@param kind string data file type, e.g. 'DLC_ITYP_REQUEST'
---@param path string
function data_file(kind, path) end

---Another resource that must start first.
---@param resource string
function dependency(resource) end

---Resources that must start first.
---@param resources string | string[]
function dependencies(resources) end

---Declare that this resource replaces another one.
---@param resource string
function provide(resource) end

---Mark this resource as a map.
---@param value boolean
function this_is_a_map(value) end

---Use this resource as the loading screen.
---@param path string
function loadscreen(path) end

---Keep the loading screen up until the resource shuts it down itself.
---@param value boolean
function loadscreen_manual_shutdown(value) end

---Meta file applied before the level loads.
---@param path string
function before_level_meta(path) end

---Meta file applied after the level loads.
---@param path string
function after_level_meta(path) end

---Meta file that replaces a level meta.
---@param name string
---@param path string
function replace_level_meta(name, path) end

---Paths the escrow packer should leave unencrypted.
---@param paths string | string[]
function escrow_ignore(paths) end

---Disable lazy native loading for this resource.
---@param value boolean
function disable_lazy_natives(value) end

---Legacy manifest version. Superseded by `fx_version`.
---@param guid string
function resource_manifest_version(guid) end
