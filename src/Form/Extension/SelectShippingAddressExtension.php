<?php

declare(strict_types=1);

namespace App\Form\Extension;

use Sylius\Bundle\AddressingBundle\Form\Type\AddressType as BaseAddressType;
use Sylius\Bundle\CoreBundle\Form\Type\Checkout\SelectShippingType;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Validator\Constraints\Valid;

final class SelectShippingAddressExtension extends AbstractTypeExtension
{
    public static function getExtendedTypes(): iterable
    {
        return [SelectShippingType::class];
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        /** @var \Sylius\Component\Core\Model\OrderInterface|null $order */
        $order = $builder->getData();
        if (!$order) {
            return;
        }

        $builder->add('shippingAddress', BaseAddressType::class, [
            'shippable'   => true,
            'mapped'      => true,
            'constraints' => [new Valid()],
            'validation_groups' => $options['validation_groups'],
        ])
            ->add('billingAddress', BaseAddressType::class, [
                'shippable'   => false,
                'mapped'      => true,
                'constraints' => [new Valid()],
                'validation_groups' => $options['validation_groups'],
            ])
            ->addEventListener(FormEvents::POST_SUBMIT, function (FormEvent $event) {
                $order = $event->getData();
                if ($order->getShippingAddress()) {
                    $order->getShippingAddress()->setCustomer($order->getCustomer());
                }
                if ($order->getBillingAddress()) {
                    $order->getBillingAddress()->setCustomer($order->getCustomer());
                }
            });


    }
}
