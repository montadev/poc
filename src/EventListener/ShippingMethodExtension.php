<?php
// src/EventListener/ShippingMethodExtension.php

namespace App\EventListener;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;

class ShippingMethodExtension implements EventSubscriber
{
    public function getSubscribedEvents()
    {
        return ['loadClassMetadata'];
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $event)
    {
        $metadata = $event->getClassMetadata();

        if ($metadata->getName() === \Sylius\Component\Core\Model\ShippingMethod::class) {
            $metadata->mapManyToMany([
                'fieldName' => 'pickupPoints',
                'targetEntity' => \App\Entity\Shipping\PickupPoint::class,
                'joinTable' => [
                    'name' => 'sylius_shipping_method_pickup_points',
                    'joinColumns' => [
                        [
                            'name' => 'shipping_method_id',
                            'referencedColumnName' => 'id'
                        ]
                    ],
                    'inverseJoinColumns' => [
                        [
                            'name' => 'pickup_point_id',
                            'referencedColumnName' => 'id'
                        ]
                    ]
                ]
            ]);
        }
    }
}
