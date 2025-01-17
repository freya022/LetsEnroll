import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlin)
    alias(libs.plugins.kotlinx.serialization)
    alias(libs.plugins.jib)

    id("me.champeau.jmh") version "0.7.2"
}

group = "dev.freya02"
version = "1.0"

repositories {
    mavenLocal()
    mavenCentral()
    maven("https://jitpack.io")
}

dependencies {
    implementation(libs.logback.classic)
    implementation(libs.stacktrace.decoroutinator)

    implementation(libs.dotenv.kotlin)

    implementation(libs.ktoml)
    implementation(libs.jackson.dataformat.yaml)

    implementation(libs.botcommands)
    implementation(libs.jda)

    implementation(libs.postgresql)
    implementation(libs.hikaricp)

    implementation(libs.bundles.flyway)

    // Mockk needs bytebuddy to be upgraded to support Java 24
    jmh(libs.mockk)
    jmh(libs.bytebuddy)
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(24)
    }

    sourceCompatibility = JavaVersion.VERSION_23
    targetCompatibility = JavaVersion.VERSION_23
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.JVM_23
    }
}

jmh {
//    includes = listOf()
//    includes = ['some regular expression'] // include pattern (regular expression) for benchmarks to be executed
//    excludes = ['some regular expression'] // exclude pattern (regular expression) for benchmarks to be executed
//    iterations = 10 // Number of measurement iterations to do.
//    benchmarkMode = ['thrpt','ss'] // Benchmark mode. Available modes are: [Throughput/thrpt, AverageTime/avgt, SampleTime/sample, SingleShotTime/ss, All/all]
//    batchSize = 1 // Batch size: number of benchmark method calls per operation. (some benchmark modes can ignore this setting)
//    fork = 2 // How many times to forks a single benchmark. Use 0 to disable forking altogether
//    failOnError = false // Should JMH fail immediately if any benchmark had experienced the unrecoverable error?
//    forceGC = false // Should JMH force GC between iterations?
//    jvm = 'myjvm' // Custom JVM to use when forking.
//    jvmArgs = ['Custom JVM args to use when forking.']
//    jvmArgsAppend = ['Custom JVM args to use when forking (append these)']
//    jvmArgsPrepend =[ 'Custom JVM args to use when forking (prepend these)']
    humanOutputFile = project.file("reports/jmh/human.txt") // human-readable output file
    resultsFile = project.file("reports/jmh/results.txt") // results file
//    operationsPerInvocation = 10 // Operations per invocation.
//    benchmarkParameters =  [:] // Benchmark parameters.
//    profilers = listOf() // Use profilers to collect additional data. Supported profilers: [cl, comp, gc, stack, perf, perfnorm, perfasm, xperf, xperfasm, hs_cl, hs_comp, hs_gc, hs_rt, hs_thr, async]
//    timeOnIteration = '1s' // Time to spend at each measurement iteration.
//    resultFormat = 'CSV' // Result format type (one of CSV, JSON, NONE, SCSV, TEXT)
//    synchronizeIterations = false // Synchronize iterations?
//    threads = 4 // Number of worker threads to run with.
//    threadGroups = [2,3,4] //Override thread group distribution for asymmetric benchmarks.
//    jmhTimeout = '1s' // Timeout for benchmark iteration.
//    timeUnit = 'ms' // Output time unit. Available time units are: [m, s, ms, us, ns].
//    verbosity = 'NORMAL' // Verbosity mode. Available modes are: [SILENT, NORMAL, EXTRA]
//    warmup = '1s' // Time to spend at each warmup iteration.
//    warmupBatchSize = 10 // Warmup batch size: number of benchmark method calls per operation.
//    warmupForks = 0 // How many warmup forks to make for a single benchmark. 0 to disable warmup forks.
//    warmupIterations = 1 // Number of warmup iterations to do.
//    warmupMode = 'INDI' // Warmup mode for warming up selected benchmarks. Warmup modes are: [INDI, BULK, BULK_INDI].
//    warmupBenchmarks = ['.*Warmup'] // Warmup benchmarks to include in the run in addition to already selected. JMH will not measure these benchmarks, but only use them for the warmup.
//
//    zip64 = true // Use ZIP64 format for bigger archives
//    jmhVersion = '1.37' // Specifies JMH version
//    includeTests = true // Allows to include test sources into generate JMH jar, i.e. use it when benchmarks depend on the test classes.
//    duplicateClassesStrategy = DuplicatesStrategy.FAIL // Strategy to apply when encountring duplicate classes during creation of the fat jar (i.e. while executing jmhJar task)
}

jib {
    from {
        image = "eclipse-temurin:23-jre@sha256:0c8b0ed419ad7a9e0cf27ba01e69f6853afd8f28836cb82ffa041b65f4137904"
    }

    to {
        image = "commandinator"
    }

    container {
        mainClass = "dev.freya02.commandinator.bot.MainKt"
    }
}
