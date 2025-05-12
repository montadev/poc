<?php

declare(strict_types=1);

namespace App;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250502191810 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE app_pickup_point (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, address LONGTEXT NOT NULL, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, active TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sylius_shipping_method_pickup_points (method_id INT NOT NULL, point_id INT NOT NULL, INDEX IDX_ABC123 (method_id), INDEX IDX_DEF456 (point_id), PRIMARY KEY(method_id, point_id)) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE sylius_shipping_method_pickup_points ADD CONSTRAINT FK_SHIPPING_METHOD FOREIGN KEY (method_id) REFERENCES sylius_shipping_method (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sylius_shipping_method_pickup_points ADD CONSTRAINT FK_PICKUP_POINT FOREIGN KEY (point_id) REFERENCES app_pickup_point (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE app_pickup_point');
        $this->addSql('DROP TABLE sylius_shipping_method_pickup_points');
    }
}
