<?php

namespace App\Form\Type\Shipping;

use App\Entity\Shipping\PickupPoint;
use Sylius\Component\Shipping\Model\ShippingMethodInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PickupPointType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Name'
            ])
            ->add('street', TextType::class, [
                'label' => 'Street'
            ])
            ->add('postalCode', TextType::class, [
                'label' => 'Postal Code'
            ])
            ->add('city', TextType::class, [
                'label' => 'City'
            ])
            ->add('latitude', NumberType::class, [
                'label' => 'Latitude',
                'scale' => 6
            ])
            ->add('longitude', NumberType::class, [
                'label' => 'Longitude',
                'scale' => 6
            ])
            ->add('active', CheckboxType::class, [
                'label' => 'Active',
                'required' => false
            ])
            ->add('shippingMethod', EntityType::class, [
                'class' => ShippingMethodInterface::class,
                'label' => 'Shipping Method',
                'choice_label' => 'name',
                'required' => true
            ]);
    }
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PickupPoint::class,
        ]);
    }
    public function getBlockPrefix(): string
    {
        return 'app_pickup_point';
    }
}
