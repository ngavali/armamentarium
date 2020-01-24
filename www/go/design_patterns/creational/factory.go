//
//	Factory pattern
//

package main

import (
        "fmt"
)

type (
        Transport interface {
                deliver()
        }

        Logistics struct {
                tf *TransportFactory
        }

        Ship struct {
        }

        Truck struct {
        }

        TransportFactory struct {
        }

        Shipment struct {
                destination int
        }

        factoryMethod func() Transport
)

var factoryMethodCollection = make(map[string]factoryMethod)

func NewShip() Transport {
        return &Ship{}
}

func (s *Ship) deliver() {
        fmt.Println("Update from Ship  101 : Shipment delivered.")
}

func NewTruck() Transport {
        return &Truck{}
}

func (t *Truck) deliver() {
        fmt.Println("Update from Truck 101 : Shipment delivered.")
}

func RegisterTransport(transportType string, method factoryMethod) {
        factoryMethodCollection[transportType] = method
}

func RegisterShipTransport() {
        RegisterTransport("Ship", NewShip)
}

func RegisterTruckTransport() {
        RegisterTransport("Truck", NewTruck)
}

func NewTransportFactory() *TransportFactory {
        return &TransportFactory{}
}

func (t *TransportFactory) CreateTransport(transportType string) Transport {
        return factoryMethodCollection[transportType]()
}

func NewLogistics(tf *TransportFactory) *Logistics {
        return &Logistics{tf}
}

func (l *Logistics) handleShipment(s *Shipment) {
        var transport Transport
        mode := map[bool]string{false: "Ship", true: "Truck"}
        transport = l.tf.CreateTransport(mode[s.inCountry()])
        transport.deliver()
}

func NewShipment(destination int) *Shipment {
        return &Shipment{destination}
}

func (s *Shipment) inCountry() bool {
        if s.destination < 1000 {
                return true
        }
        return false
}

func init() {
        RegisterShipTransport()
        RegisterTruckTransport()
}

func main() {
        tf := NewTransportFactory()
        lg := NewLogistics(tf)
        s1 := NewShipment(10)
        s2 := NewShipment(3000)

        lg.handleShipment(s1)
        lg.handleShipment(s2)
}
