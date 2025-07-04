import nl.littlerobots.vcu.plugin.resolver.VersionSelectors

plugins {
    alias(libs.plugins.version.catalog.update)
}

repositories {
    mavenCentral()
}

versionCatalogUpdate {
    versionSelector(VersionSelectors.PREFER_STABLE)
}
