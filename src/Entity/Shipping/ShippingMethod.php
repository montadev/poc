<?php
// src/Entity/Shipping/ShippingMethod.php

namespace App\Entity\Shipping;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Sylius\Component\Core\Model\ShippingMethod as BaseShippingMethod;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_shipping_method')]
class ShippingMethod extends BaseShippingMethod
{
    #[ORM\ManyToMany(targetEntity: PickupPoint::class)]
    #[ORM\JoinTable(name: 'sylius_shipping_method_pickup_points',
        joinColumns: [new ORM\JoinColumn(name: 'method_id', referencedColumnName: 'id')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'point_id', referencedColumnName: 'id')]
    )]
    private ?Collection $pickupPoints = null;

    public function __construct()
    {
        parent::__construct();
        $this->pickupPoints = new ArrayCollection();
    }

    public function getPickupPoints(): Collection
    {
        if (null === $this->pickupPoints) {
            $this->pickupPoints = new ArrayCollection();
        }
        return $this->pickupPoints;
    }

    public function isPickupPointMethod(): bool
    {
        return $this->getCode() && str_starts_with($this->code, 'pr_');
    }

    public function addPickupPoint(PickupPoint $pickupPoint): void
    {
        if (!$this->getPickupPoints()->contains($pickupPoint)) {
            $this->getPickupPoints()->add($pickupPoint);
        }
    }

}
