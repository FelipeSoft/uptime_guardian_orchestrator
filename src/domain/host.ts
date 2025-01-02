import Network from "./network";

type AddressAssignment = {
    dhcp: 0;
    static: 1;
}

type Priority = {
    low: 0;
    medium: 1;
    high: 2;
}

type HostTimeoutRange = {
    start: number;
    end: number;
}

export class HostException extends Error {
    public constructor(message: string) {
        super(message)
    }
}

export default class Host {
    public constructor(
        private readonly network: Network,
        private ipv4: string,
        private priority: Priority,
        public addressAssignment: AddressAssignment,
        public macAddress: string,
        public disabled: boolean,
        public port: number,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: string,
        public hostname?: string | undefined,
        public dns?: string | undefined,
        private ipv6?: string | undefined,
    ) {
        this.changeIPv4(ipv4);
        this.changeIPv6(ipv6);
        this.definePriority(priority);
    }

    public definePriority(priority: Priority) {

    }

    public getTimeoutRange() {

    }

    public changeIPv4(ipv4: string) {
        const isNotValidHostIPv4 = this.validateIPv4(ipv4) === false;
        if (isNotValidHostIPv4) {
            throw new HostException(this.id !== undefined
                ? `Inside the ID [${this.network.id}] Network, could not define the Host IPv4; the provided IPv4 for ID [${this.id}] Host was: ${ipv4}; check the syntax and try again.`
                : `Inside the ID [${this.network.id}] Network, could not define the Host IPv4; the provided IPv4 on Host creation was: ${ipv4}; check the syntax and try again.`
            )
        }

        let foundExistingHostByIPv4: Host;
        let existingIPv4 = false;
        let networkHosts = this.network.getAvailableHosts();

        for (let host of networkHosts) {
            const currentIP = host.ipv4;
            if (currentIP === ipv4) {
                foundExistingHostByIPv4 = host;
                existingIPv4 = true;
                break;
            }
        }

        if (existingIPv4 && foundExistingHostByIPv4) {
            throw new HostException(`Inside the ID [${this.network.id}] Network, could not define the Host IPv4; the provided ${this.ipv4} for Host ID [${this.id}] is already in use by Host ID [${foundExistingHostByIPv4.id}];`)
        }

        this.ipv4 = ipv4;
        return;
    }

    public assignedIPv4(): string {
        return this.ipv4;
    }

    public changeIPv6(ipv6?: string | undefined) {
        const isNotValidHostIPv6 = this.validateIPv6(ipv6) === false;
        if (isNotValidHostIPv6) {
            throw new HostException(this.id !== undefined
                ? `Inside the ID [${this.network.id}] Network, could not define the Host IPv6; the provided IPv6 for ID [${this.id}] Host was: ${ipv6}; check the syntax and try again.`
                : `Inside the ID [${this.network.id}] Network, could not define the Host IPv6; the provided IPv6 on Host creation was: ${ipv6}; check the syntax and try again.`
            )
        }

        let foundExistingHostByIPv6: Host;
        let existingIPv6 = false;
        let networkHosts = this.network.getAvailableHosts();

        for (let host of networkHosts) {
            const currentIP = host.ipv6;
            if (currentIP === ipv6) {
                foundExistingHostByIPv6 = host;
                existingIPv6 = true;
                break;
            }
        }

        if (existingIPv6 && foundExistingHostByIPv6) {
            throw new HostException(`Inside the ID [${this.network.id}] Network, could not define the Host IPv6; the provided ${this.ipv6} for Host ID [${this.id}] is already in use by Host ID [${foundExistingHostByIPv6.id}];`)
        }

        this.ipv6 = ipv6;
        return;
    }

    public assignedIPv6(): string | undefined {
        return this.ipv6;
    }

    private validateIPv4(ipv4: string): boolean {
        const ipv4Regex = /^(?:(?:0|1\d{0,2}|2[0-4]\d|25[0-5]|[3-9]\d?)\.){3}(?:0|1\d{0,2}|2[0-4]\d|25[0-5]|[3-9]\d?)$/;
        return ipv4Regex.test(ipv4);
    }

    private validateIPv6(ipv6: string): boolean {
        const ipv6Regex = /^(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}$|^(?:[A-Fa-f0-9]{1,4}:)*::(?:[A-Fa-f0-9]{1,4}:)*[A-Fa-f0-9]{1,4}$|^(?:[A-Fa-f0-9]{1,4}:){0,7}:?(?:[A-Fa-f0-9]{1,4}:){0,6}(?:[A-Fa-f0-9]{1,4}|(?:[0-9]{1,3}\.){3}[0-9]{1,3})$/;
        return ipv6Regex.test(ipv6);
    }
}