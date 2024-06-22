import alfy from 'alfy'

// Default options
const defaultOptions = {
    smartLocation: {
        title: 'Connect to: Smart Location',
        subtitle: 'Recommended • Activate ExpressVPN Connection',
        arg: 'Smart Location',
        uid: 'smartlocation'
    },
    disconnect: {
        title: 'Disconnect',
        subtitle: 'Disconnect from ExpressVPN server',
        arg: 'Disconnect',
        uid: 'disconnect'
    },
    quit: {
        title: 'Quit App',
        subtitle: 'Quits the ExpressVPN app',
        arg: 'Quit',
        uid: 'quit'
    }
}

let items = []

// Default options (no input)
if (alfy.input === '') {
    items.push(
        ...Object.values(defaultOptions)
    )
}

// Search for VPN server
else {
    const unparsedVPNServers = Object.values(await alfy.fetch('https://www.expressvpn.com/wap/api/v1/vpn-servers'))

    const vpnServers = unparsedVPNServers
        .flat()
        .map(location => location.clusters)
        .flat()
        .sort((a, b) => a.name.localeCompare(b.name))
    
    vpnServers
        .filter((item) => item.name.toLowerCase().includes(alfy.input.trim().toLowerCase()))
        .forEach(element => items.push({
            title: 'Connect to: ' + element.name,
            subtitle: 'Activate ExpressVPN connection',
            arg: element.name,
            uid: element.cluster_id,
            icon: {
                path: `./countryflags/${element.country_code}.png`
            }
        }))

    // Default options
    switch (alfy.input.toLowerCase().trim()[0]) {
        case 's':
            items.unshift(defaultOptions.smartLocation)
            break
        case 'd':
            items.unshift(defaultOptions.disconnect)
            break
        case 'q':
            items.unshift(defaultOptions.quit)
            break
    }
}

alfy.output(items)