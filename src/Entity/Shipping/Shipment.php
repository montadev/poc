<?php

// src/Entity/Shipping/Shipment.php

namespace App\Entity\Shipping;

use Doctrine\ORM\Mapping as ORM;
use Sylius\Component\Core\Model\Shipment as BaseShipment;
use App\Entity\Shipping\PickupPoint;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_shipment')]
class Shipment extends BaseShipment
{
    #[ORM\ManyToOne(targetEntity: PickupPoint::class)]
    #[ORM\JoinColumn(name: 'pickup_point_id', referencedColumnName: 'id')]
    private ?PickupPoint $pickupPoint = null;

    public function getPickupPoint(): ?PickupPoint
    {
        return $this->pickupPoint;
    }

    public function setPickupPoint(?PickupPoint $pickupPoint): void
    {
        $this->pickupPoint = $pickupPoint;
    }
    public function removePickupPoint(): void
    {
        $this->pickupPoint = null;
    }

}
