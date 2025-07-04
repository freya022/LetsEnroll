plugins {
    id("letsenroll-conventions")
    id("letsenroll-app-conventions")
    alias(libs.plugins.kotlinx.serialization)

    alias(libs.plugins.jmh)
}

dependencies {
    // Configuration
    implementation(libs.dotenv.kotlin)

    implementation(libs.kotlin.logging)

    // Serialization (data and localization)
    implementation(libs.jackson.dataformat.yaml)
    implementation(libs.kotlinx.serialization.json)

    implementation(libs.botcommands) {
        exclude(module = "opus-java")
        exclude(module = "tink")
    }
    implementation(libs.jda) {
        exclude(module = "opus-java")
        exclude(module = "tink")
    }

    implementation(libs.postgresql)
    implementation(libs.hikaricp)

    implementation(libs.bundles.flyway)

    implementation(libs.nimbus.jose.jwt)

    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)

    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.resources)
    implementation(libs.ktor.server.content.negotiation)

    implementation(projects.data)

    testImplementation(libs.bundles.testing)
    testImplementation(libs.mockk)

    jmh(libs.mockk)
}

jmh {
//    includes = listOf()
//    includes = ['some regular expression'] // include pattern (regular expression) for benchmarks to be executed
//    excludes = ['some regular expression'] // exclude pattern (regular expression) for benchmarks to be executed
//    iterations = 10 // Number of measurement iterations to do.
//    benchmarkMode = ['thrpt','ss'] // Benchmark mode. Available modes are: [Throughput/thrpt, AverageTime/avgt, SampleTime/sample, SingleShotTime/ss, All/all]
//    batchSize = 1 // Batch size: number of benchmark method calls per operation. (some benchmark modes can ignore this setting)
//    fork = 2 // How many times to forks a single benchmark. Use 0 to disable forking altogether
    failOnError = true // Should JMH fail immediately if any benchmark had experienced the unrecoverable error?
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
        image = "eclipse-temurin:24-jdk"
    }

    to {
        image = "ghcr.io/freya022/letsenroll-bot"
    }

    container {
        mainClass = "dev.freya02.letsenroll.bot.MainKt"
    }
}
